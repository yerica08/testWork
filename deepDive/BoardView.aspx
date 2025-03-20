<%@ Page Language="VB" AutoEventWireup="false" CodeFile="BoardView.aspx.vb" Inherits="DsttsBoard_BoardView" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>제목 없음</title>

<script>

    function loading() {
        a.style.display = "none";
        //b.style.filter="blendTrans(duration=0.3)";
        //b.filters.blendTrans.apply();
        b.style.visibility = "visible";
        //b.filters.blendTrans.play();
    }

</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

    * {
        font-family: "Noto Sans KR", serif;
    }

    #b {
        margin-left: 10px;
    }

    a:visited,
    a:link {
        text-decoration: underline;
        text-decoration-color: red;
        color: black;
    }

    a:active {
        text-decoration: none;
        color: black;
    }

    a:hover {
        text-decoration: none;
        color: dodgerblue;
    }

    font:hover {
        color: dodgerblue;
    }

    #chkDay {
        width: 16px;
        height: 16px;
        margin: 0;
        margin-right: 5px;
        cursor: pointer;
    }

    label[for="chkDay"] {
        font-weight: 500;
        font-size: 15px;
        font-weight: 400;
        cursor: pointer;
    }

    select, input[type="text"], input[type="date"] {
        font-family: "Noto Sans KR", serif;
        height: 28px;
        border: 1px solid #aaa;
        border-radius: 3px;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        box-sizing: border-box;
        margin-top: 3px;
    }

    input[type="date"] {
        margin-top: 3px;
    }

    td {
        font-size: 14px;
        padding: 0;
        border: 0;
    }

    .table_header {
        height: 48px;
        border-top: 1px solid #cecece;
        border-bottom: 2px solid #598CBD;
    }

    #cmdSearch {
        width: 80px;
        height: 28px;
        background-color: #fff;
        border: 1px solid #598CBD;
        color: #598CBD;
        border-radius: 3px;
        padding: 10px;
        line-height: 0px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        vertical-align: bottom;
        margin-left: 20px;
    }

        #cmdSearch:hover {
            background-color: #598CBD;
            color: #fff;
        }

    input[type="radio"] {
        display: none;
    }

        input[type="radio"] + label {
            cursor: pointer;
            color: #666;
        }

        input[type="radio"]:checked + label {
            position: relative;
            color: #598CBD;
        }

            input[type="radio"]:checked + label::after {
                display: block;
                content: "";
                width: 60px;
                height: 3px;
                background-color: #598CBD;
                position: absolute;
                bottom: -9px;
                left: 50%;
                transform: translateX(-50%);
            }

    input[type="text"] {
        cursor: text;
    }

    .wrapper > table {
        width: calc(100vw - 200px);
        max-width: 1280px;
        min-width: 1000px;
    }

    #fpsList td {
        text-align: center;
    }

    #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
        border-bottom: 1px solid #eee;
        height: 40px;
    }

    @media screen and (min-width: 1200px) {
        td {
            font-size: 15px;
        }

        #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
            border-bottom: 1px solid #eee;
            height: 50px;
        }
    }
</style>
    
</head>
<body onload="setTimeout('loading()',100)" topmargin="0">
    <form id="form1" runat="server">
    <div id="b" class="wrapper">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td align="right" colspan="3" style="width: 98%;">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                        <tr>
                            <td align="center" colspan="2" style="height: 25px">
                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                    <tr>
                                        <td align="right" colspan="2">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%; vertical-align: bottom;">
                                            <asp:Label ID="labTitle" runat="server" style="font-weight: 500; font-size:22px; padding-left: 10px;"></asp:Label>
                                        </td>
                                        <td align="right" style="width: 50%; vertical-align: bottom;">
                                            <asp:CheckBox ID="chkDay" runat="server" Font-Size="16px" ForeColor="#2461BF"
                                                Text="업무일지, 회람 포함" Visible="False" style="margin-right: 10px; cursor:pointer; display: flex; justify-content: right; align-items: center; "/>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style="height:12px;"></tr>
                        <tr><td style="height: 1px; background-color:#9d9d9d;"></td></tr>
                        <tr style="color: #000000; background-color: #F3F3F3;">
                            <td align="left" colspan="2">
                                <table cellpadding="0" cellspacing="0" style="font-size: 9pt; width: 100%; margin: 10px 0;">
                                    <tr style="height: 38px;">
                                        <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">문서구분</td>
                                        <td style="vertical-align: middle; width: 300px; text-align: left; padding-left: 10px;">
                                            <asp:DropDownList ID="cmbSection" runat="server" AutoPostBack="True" style="font-size: 14px; padding-left: 10px; width:400px; margin-top: 3px;"></asp:DropDownList>
                                        </td>
                                    </tr>
                                    <tr style="height: 38px;">
                                        <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">날 &nbsp; &nbsp; &nbsp; 짜</td>
                                        <td style="padding-left: 10px; vertical-align: middle; width: 400px; text-align: left;">
                                            <asp:TextBox ID="txtDate" runat="server" TextMode="Date" BorderWidth="1px" Style=" box-sizing: border-box; width: 186px;
                                                text-align: center"></asp:TextBox>
                                            <span style="display:inline-block; text-align:center; width: 20px; font-size: 16px; line-height: 11px;">~</span>
                                            <asp:TextBox ID="txtDate2" runat="server" TextMode="Date" BorderWidth="1px" Style=" box-sizing: border-box; width: 186px;
                                                text-align: center"></asp:TextBox>
                                        </td>
                                    </tr>
                                    
                                    <tr style="height: 38px;">
                                        <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">제목찾기</td>
                                        <td colspan="3" style="vertical-align: middle; height: 25px; text-align: left; padding-left: 10px;">
                                            <asp:TextBox ID="txtTitle" runat="server" BorderWidth="1px" style="width: 400px; box-sizing: border-box; margin-top: 3px;" ></asp:TextBox>
                                            <asp:CheckBox ID="chkTrans" runat="server" Visible="False" style="width: 400px; box-sizing: border-box; margin-top: 3px;" />
                                            <%--TODO : imgaeButton 에서 일반 Button으로 바꿨기 때문에, 'System.Web.UI.ImageClickEventArgs' 형식 개체를 'System.EventArgs' 형식으로--%>  
                                            <asp:Button ID="cmdSearch" runat="server" Text="검색"/>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr><td style="height: 1px; background-color:#9d9d9d;"></td></tr>
                        <tr style="height: 28px;"></tr>
                        <tr style="height: 38px;">
                            <td style="width: 300px">
                                <asp:Panel ID="Panel2" runat="server" Style="vertical-align: middle; width: 300px; text-align: center; margin-left: 4px;" Width="100%">
                                    <asp:RadioButtonList style="font-weight:400; font-size: 15px; color: #555; VERTICAL-ALIGN: middle; WIDTH: 290px; TEXT-ALIGN: center" id="radSelect" runat="server" Font-Size="9pt" Font-Bold="True" AutoPostBack="True" Width="100%" RepeatDirection="Horizontal">
                                        <asp:ListItem Value="4" Selected="True">전체</asp:ListItem>
                                        <asp:ListItem Value="1">완료</asp:ListItem>
                                        <asp:ListItem Value="0">진행중</asp:ListItem>
                                        <asp:ListItem Value="2">보류</asp:ListItem>
                                        <asp:ListItem Value="3">반려</asp:ListItem>
                                    </asp:RadioButtonList>
                                </asp:Panel>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" colspan="3" style="width: 98%;" valign="top">
                    <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False" CellPadding="4"
                        Font-Overline="False" Font-Strikeout="False" Font-Underline="False" ForeColor="#333333" GridLines="None" Width="100%">
                        <EditItemStyle BackColor="#2461BF" />
                        <SelectedItemStyle BackColor="#598CBD" ForeColor="#ffffff" Font-Bold="True" />
                        <PagerStyle BackColor="#f3f3f3" ForeColor="#555555" HorizontalAlign="Center" Mode="NumericPages" Height="32px"/>
                        <AlternatingItemStyle BackColor="White" />
                        <HeaderStyle BackColor="#ffffff" Font-Bold="False" ForeColor="#000000" HorizontalAlign="center" CssClass="table_header"/>
                        <Columns>
                            <asp:BoundColumn HeaderText="문서번호">
                                <HeaderStyle Width="120px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}" HeaderText="날짜">
                                <HeaderStyle Width="70px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn DataField="sectionName" HeaderText="문서종류">
                                <HeaderStyle Width="110px" />
                                <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                    Font-Underline="False" HorizontalAlign="Left" VerticalAlign="Middle" />
                            </asp:BoundColumn>
                            <asp:BoundColumn DataField="username" HeaderText="작성자">
                                <HeaderStyle Width="50px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn HeaderText="문서제목">
                                <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                    Font-Underline="False" HorizontalAlign="Left" />
                                <FooterStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                    Font-Underline="False" HorizontalAlign="Left" />
                                <HeaderStyle Width="230px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn HeaderText="진행현황" Visible="False">
                                <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                    Font-Underline="False" HorizontalAlign="Center" />
                            </asp:BoundColumn>
                            <asp:BoundColumn HeaderText="완료여부">
                                <HeaderStyle Width="60px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn HeaderText="공개여부">
                                <HeaderStyle Width="70px" />
                            </asp:BoundColumn>
                            <asp:ButtonColumn ButtonType="PushButton" CommandName="Select" HeaderText="선택" Text="상세">
                                <HeaderStyle Width="40px" />
                            </asp:ButtonColumn>
                            <asp:BoundColumn DataField="text1" HeaderText="처리여부">
                                <HeaderStyle Width="60px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn HeaderText="품의서">
                                <HeaderStyle Width="50px" />
                            </asp:BoundColumn>
                            <asp:BoundColumn DataField="SectionCode" HeaderText="SectionCode" Visible="False"></asp:BoundColumn>
                            <asp:BoundColumn DataField="seqno" HeaderText="SeqNo" Visible="False"></asp:BoundColumn>
                        </Columns>
                    </asp:DataGrid>
                    &nbsp; &nbsp;
                </td>
            </tr>
            <tr>
                <td align="right" colspan="3" style="width: 98%; height: 25px;">
                    <asp:Label ID="labView" runat="server" Font-Size="11pt" Style="font-weight: bold; font-size: 10pt; font-family: 돋움" Font-Bold="True" ForeColor="Maroon"></asp:Label>
                </td>
            </tr>
            <tr>
                <td align="left" colspan="3" style="width: 98%;WORD-BREAK:break-all;">
                    <asp:Label ID="labComment" runat="server" Font-Bold="False" Font-Size="10pt"></asp:Label>
                    <asp:DataList ID="DataList1" runat="server" CellPadding="4" Font-Bold="False" Font-Italic="False"
                        Font-Overline="False" Font-Size="9pt" Font-Strikeout="False" Font-Underline="False"
                        ForeColor="#0B1215" Style="width: 100%; font-size: 9px;" Width="100%">
                        <FooterStyle BackColor="#f3f3f3" Font-Bold="True" ForeColor="White" />
                        <SelectedItemStyle BackColor="#598CBD" Font-Bold="True" ForeColor="#ffffff" />
                        <ItemTemplate>
                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                <tr>
                                    <td style="font-weight: bold; width: 5%; height: 12px">
                                        <%#DataBinder.Eval(Container.DataItem, "UserName")%>
                                    </td>
                                    <td style="vertical-align: middle; width: 20%; height: 12px; text-align: center">
                                        <%#DataBinder.Eval(Container.DataItem, "entrydate")%>
                                    </td>
                                    <td style="vertical-align: middle; width: 75%; height: 12px; text-align: left">
                                        <%#DataBinder.Eval(Container.DataItem, "memo")%>
                                    </td>
                                </tr>
                            </table>
                        </ItemTemplate>
                        <AlternatingItemStyle BackColor="White" />
                        <ItemStyle BackColor="#ffffff" />
                        <HeaderTemplate>첨부의견</HeaderTemplate>
                        <HeaderStyle BackColor="#f3f3f3" Font-Bold="True" ForeColor="#000000" />
                    </asp:DataList>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="width: 98%; font-size: 9pt; height: 150px; border-right-width: 1px; border-right-color: black;">
                    <br />
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 9pt; font-family: 돋움;">
                        <tr>
                            <td align="center" style="color: #fff; font-weight: 400; width: 50%; height: 42px; background-color: #598CBD; border-right: 4px solid #fff; " valign="middle">결재자 명단</td>
                            <td align="center" style="color: #fff; font-weight: 400; width: 50%; height: 42px; background-color: #598CBD; " valign="middle">미결재자 명단</td>
                        </tr>
                        <tr>
                            <td style="width: 50%; border-right: 4px solid #fff;" valign="top" height="120">
                                <iframe id="SubDetail" frameborder="0" height="120" name="WebEditIFrame" src="Board_View/ViewSign.aspx?nSeqNo=<%= nSeqNo %>"
                                    style="vertical-align: middle; text-align: center; font-size: 9pt;" tabindex="5" width="100%" scrolling="yes"></iframe>
                            </td>
                            <td style="width: 50%;" valign="top">
                                <iframe id="SubDetail2" frameborder="0" height="120" name="WebEditIFrame" src="Board_View/ViewSignMi.aspx?nSeqNo=<%= nSeqNo %>"
                                    style="vertical-align: middle; text-align: center; font-size: 9pt;" tabindex="5" width="100%" scrolling="yes"></iframe>
                            </td>
                        </tr>
                    </table>
                 </td>
            </tr>
            <tr>
                <td colspan="3" style="width: 98%">
                    <asp:Panel ID="Panel1" runat="server" Height="50px" Visible="False" Width="100%">
                        결제 진행 현황(상세 Click)<br />
                        &nbsp;<asp:Label ID="labPro" runat="server" Font-Bold="False" Font-Size="10pt" Style="font-size: 10pt; font-family: 돋움"></asp:Label><br />
                        <asp:Panel ID="panSign1" runat="server" Visible="False" Width="100%">
                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; height: 100%">
                                <tr>
                                    <td align="right" style="width: 100%">
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 645px; height: 105px; border:1px solid #000000">
                                            <tr>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid;">
                                                    <asp:Label ID="labFlag01" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag02" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag03" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag04" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag05" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag06" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag07" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag08" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid;">
                                                    <asp:Label ID="labFlag09" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid; border-right: black 1px solid;">
                                                    <asp:Label ID="labFlag10" runat="server" Font-Size="9pt"></asp:Label></td>
                                            </tr>
                                            <tr>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign01" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid; border-right: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign02" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid; border-right: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign03" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign04" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign05" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign06" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign07" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign08" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign09" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid;" /></td>
                                                <td style="width: 64px; height: 55px">
                                                    <asp:Image ID="imgSign10" runat="server" Height="55px" Width="64px" style="border-top: black 1px solid; border-left: black 1px solid; border-right: black 1px solid;" /></td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="width: 64px; height: 25px; border: black 1px solid;">
                                                    <asp:Label ID="labNa01" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-left: black 1px solid; border-top: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa02" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa03" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa04" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa05" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa06" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa07" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa08" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border-top: black 1px solid; border-left: black 1px solid; border-bottom: black 1px solid;">
                                                    <asp:Label ID="labNa09" runat="server" Font-Size="9pt"></asp:Label></td>
                                                <td align="center" style="width: 64px; height: 25px; border: black 1px solid;">
                                                    <asp:Label ID="labNa10" runat="server" Font-Size="9pt" Width="56px"></asp:Label></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </asp:Panel>
                    </asp:Panel>
                  
                </td>
            </tr>
        </table>
    
    </div>
        <div id="a" style="position:absolute;visibility: visible; left: 283px; top: 239px; z-index:3; border:solid 1px #808CFF">
        <img src="../Images/30.GIF" /></div>
        
        <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" Format="yyyy-MM-dd"
            PopupButtonID="cmdCal" TargetControlID="txtDate">
        </ajaxToolkit:CalendarExtender>
        <ajaxToolkit:CalendarExtender ID="calendarButtonExtender2" runat="server" Format="yyyy-MM-dd"
            PopupButtonID="cmdCal2" TargetControlID="txtDate2">
        </ajaxToolkit:CalendarExtender>
    </form>
</body>
</html>
